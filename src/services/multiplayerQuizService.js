import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { generateQuiz } from './quizService';

export const multiplayerQuizService = {
  // Create a new multiplayer quiz room
  createQuizRoom: async (quizType, difficulty) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Generate a unique room code (6 characters)
      const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Generate quiz questions
      const quiz = await generateQuiz(quizType, difficulty);
      
      // Create room in the database
      const { data, error } = await supabase
        .from('multiplayer_rooms')
        .insert({
          id: uuidv4(),
          room_code: roomCode,
          creator_id: userData.user.id,
          quiz_type: quizType,
          difficulty,
          status: 'waiting',
          max_players: 4,
          questions: quiz.questions,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Join the room as the first player
      await multiplayerQuizService.joinQuizRoom(roomCode);
      
      return data;
    } catch (error) {
      console.error('Error creating quiz room:', error);
      throw error;
    }
  },
  
  // Join an existing quiz room
  joinQuizRoom: async (roomCode) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Get room data
      const { data: room, error: roomError } = await supabase
        .from('multiplayer_rooms')
        .select('*, players:multiplayer_players(*)')
        .eq('room_code', roomCode)
        .single();
        
      if (roomError) throw roomError;
      
      if (!room) {
        throw new Error('Room not found');
      }
      
      if (room.status !== 'waiting') {
        throw new Error('Game already in progress');
      }
      
      if (room.players && room.players.length >= room.max_players) {
        throw new Error('Room is full');
      }
      
      // Check if player is already in the room
      const isPlayerInRoom = room.players.some(player => player.user_id === userData.user.id);
      
      if (!isPlayerInRoom) {
        // Add player to the room
        const { error: playerError } = await supabase
          .from('multiplayer_players')
          .insert({
            room_id: room.id,
            user_id: userData.user.id,
            status: 'ready',
            score: 0,
            answers: []
          });
          
        if (playerError) throw playerError;
      }
      
      return room;
    } catch (error) {
      console.error('Error joining quiz room:', error);
      throw error;
    }
  },
  
  // Start a multiplayer quiz
  startQuiz: async (roomId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Get room data
      const { data: room, error: roomError } = await supabase
        .from('multiplayer_rooms')
        .select('creator_id')
        .eq('id', roomId)
        .single();
        
      if (roomError) throw roomError;
      
      // Only the creator can start the game
      if (room.creator_id !== userData.user.id) {
        throw new Error('Only the room creator can start the game');
      }
      
      // Update room status
      const { error: updateError } = await supabase
        .from('multiplayer_rooms')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', roomId);
        
      if (updateError) throw updateError;
      
      return { success: true };
    } catch (error) {
      console.error('Error starting quiz:', error);
      throw error;
    }
  },
  
  // Submit an answer in a multiplayer quiz
  submitAnswer: async (roomId, questionIndex, answer, timeSpent) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }
      
      // Get player data
      const { data: player, error: playerError } = await supabase
        .from('multiplayer_players')
        .select('id, answers, score')
        .eq('room_id', roomId)
        .eq('user_id', userData.user.id)
        .single();
        
      if (playerError) throw playerError;
      
      // Get question data from room
      const { data: room, error: roomError } = await supabase
        .from('multiplayer_rooms')
        .select('questions')
        .eq('id', roomId)
        .single();
        
      if (roomError) throw roomError;
      
      const question = room.questions[questionIndex];
      const isCorrect = question.correctAnswer === answer;
      
      // Calculate score
      const baseScore = isCorrect ? 100 : 0;
      // Adjust time bonus calculation to be more balanced
      const timeBonus = isCorrect ? Math.max(0, Math.floor((50 - timeSpent) * 1.5)) : 0;
      const questionScore = baseScore + timeBonus;
      
      // Update player's answers and score
      const answers = [...(player.answers || [])];
      answers[questionIndex] = {
        questionIndex,
        answer,
        isCorrect,
        timeSpent,
        score: questionScore
      };
      
      const totalScore = player.score + questionScore;
      
      // Update player data
      const { error: updateError } = await supabase
        .from('multiplayer_players')
        .update({
          answers,
          score: totalScore,
          last_answer_at: new Date().toISOString()
        })
        .eq('id', player.id);
        
      if (updateError) throw updateError;
      
      return {
        isCorrect,
        score: questionScore,
        totalScore
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },
  
  // Get real-time updates for a quiz room
  subscribeToRoom: (roomId, callback) => {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'multiplayer_rooms',
        filter: `id=eq.${roomId}`
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  },
  
  // Get real-time updates for players in a room
  subscribeToPlayers: (roomId, callback) => {
    return supabase
      .channel(`players:${roomId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'multiplayer_players',
        filter: `room_id=eq.${roomId}`
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  }
};