import { useState, useCallback, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { useErrorHandler } from './useErrorHandler';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const [subscriptions, setSubscriptions] = useState([]);

  // Generic query function
  const query = useCallback(async (queryFn) => {
    setLoading(true);
    try {
      const result = await queryFn(supabase);
      if (result.error) throw result.error;
      return { data: result.data, error: null };
    } catch (error) {
      const errorObj = handleError(error);
      return { data: null, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Select data
  const select = useCallback(async (table, options = {}) => {
    return query(async (client) => {
      let queryBuilder = client.from(table).select(options.columns || '*');
      
      // Apply filters
      if (options.filters) {
        options.filters.forEach(filter => {
          const [column, operator, value] = filter;
          queryBuilder = queryBuilder[operator](column, value);
        });
      }
      
      // Apply order
      if (options.order) {
        const [column, direction] = options.order;
        queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
      }
      
      // Apply pagination
      if (options.limit) {
        queryBuilder = queryBuilder.limit(options.limit);
      }
      
      if (options.offset) {
        queryBuilder = queryBuilder.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      // Get single row if specified
      if (options.single) {
        return queryBuilder.single();
      }
      
      return queryBuilder;
    });
  }, [query]);

  // Insert data
  const insert = useCallback(async (table, data, options = {}) => {
    return query(async (client) => {
      let queryBuilder = client.from(table).insert(data);
      
      if (options.upsert) {
        queryBuilder = queryBuilder.upsert(data);
      }
      
      if (options.returning) {
        queryBuilder = queryBuilder.select();
      }
      
      return queryBuilder;
    });
  }, [query]);

  // Update data
  const update = useCallback(async (table, data, options = {}) => {
    return query(async (client) => {
      let queryBuilder = client.from(table).update(data);
      
      // Apply match condition
      if (options.match) {
        const [column, value] = options.match;
        queryBuilder = queryBuilder.eq(column, value);
      }
      
      if (options.returning) {
        queryBuilder = queryBuilder.select();
      }
      
      return queryBuilder;
    });
  }, [query]);

  // Delete data
  const remove = useCallback(async (table, options = {}) => {
    return query(async (client) => {
      let queryBuilder = client.from(table).delete();
      
      // Apply match condition
      if (options.match) {
        const [column, value] = options.match;
        queryBuilder = queryBuilder.eq(column, value);
      }
      
      if (options.returning) {
        queryBuilder = queryBuilder.select();
      }
      
      return queryBuilder;
    });
  }, [query]);

  // Upload file to storage
  const uploadFile = useCallback(async (bucket, path, file, options = {}) => {
    return query(async (client) => {
      const { publicUrl = false } = options;
      
      const result = await client.storage.from(bucket).upload(path, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert || false
      });
      
      if (result.error) throw result.error;
      
      // Get public URL if requested
      if (publicUrl && result.data) {
        const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
        return { ...result, publicUrl: urlData.publicUrl };
      }
      
      return result;
    });
  }, [query]);

  // Delete file from storage
  const deleteFile = useCallback(async (bucket, path) => {
    return query(async (client) => {
      return client.storage.from(bucket).remove([path]);
    });
  }, [query]);

  // Call RPC function
  const callRpc = useCallback(async (functionName, params = {}) => {
    return query(async (client) => {
      return client.rpc(functionName, params);
    });
  }, [query]);

  // Batch operations
  const batchInsert = useCallback(async (table, records, batchSize = 100, options = {}) => {
    if (!records || records.length === 0) {
      return { data: [], error: null };
    }

    setLoading(true);
    try {
      const results = [];
      const batches = [];

      // Split records into batches
      for (let i = 0; i < records.length; i += batchSize) {
        batches.push(records.slice(i, i + batchSize));
      }

      // Process each batch
      for (const batch of batches) {
        const { data, error } = await insert(table, batch, options);
        if (error) throw error;
        if (data) results.push(...data);
      }

      return { data: results, error: null };
    } catch (error) {
      const errorObj = handleError(error);
      return { data: null, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [insert, handleError]);

  // Complex query with joins
  const joinTables = useCallback(async (mainTable, options = {}) => {
    const { 
      columns = '*', 
      joins = [], 
      filters = [], 
      order, 
      limit, 
      offset, 
      single = false 
    } = options;

    return query(async (client) => {
      // Build select statement with joins
      let selectStatement = columns;
      if (joins.length > 0) {
        joins.forEach(join => {
          const { table, columns: joinColumns, on, type = 'inner' } = join;
          if (joinColumns) {
            selectStatement += `, ${joinColumns}`;
          }
        });
      }

      let queryBuilder = client.from(mainTable).select(selectStatement);

      // Apply joins
      if (joins.length > 0) {
        joins.forEach(join => {
          const { table, on, type = 'inner' } = join;
          const foreignKey = on.split('=')[0].trim();
          const primaryKey = on.split('=')[1].trim();
          
          // Add foreign table
          queryBuilder = queryBuilder[`${type}Join`](table, foreignKey, primaryKey);
        });
      }

      // Apply filters
      if (filters.length > 0) {
        filters.forEach(filter => {
          const [column, operator, value] = filter;
          queryBuilder = queryBuilder[operator](column, value);
        });
      }

      // Apply order
      if (order) {
        const [column, direction] = order;
        queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
      }

      // Apply pagination
      if (limit) {
        queryBuilder = queryBuilder.limit(limit);
      }

      if (offset) {
        queryBuilder = queryBuilder.range(offset, offset + (limit || 10) - 1);
      }

      // Get single row if specified
      if (single) {
        return queryBuilder.single();
      }

      return queryBuilder;
    });
  }, [query]);

  // Subscribe to real-time changes
  const subscribe = useCallback((table, options = {}, callback) => {
    const { event = '*', filters = [] } = options;
    
    let subscription = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', {
        event,
        schema: 'public',
        table
      }, (payload) => {
        // Apply client-side filters if any
        let matchesFilters = true;
        if (filters.length > 0) {
          matchesFilters = filters.every(filter => {
            const [column, operator, value] = filter;
            const recordValue = payload.new[column];
            
            switch (operator) {
              case 'eq': return recordValue === value;
              case 'neq': return recordValue !== value;
              case 'gt': return recordValue > value;
              case 'gte': return recordValue >= value;
              case 'lt': return recordValue < value;
              case 'lte': return recordValue <= value;
              default: return true;
            }
          });
        }
        
        if (matchesFilters) {
          callback(payload);
        }
      })
      .subscribe();
    
    // Store subscription reference
    setSubscriptions(prev => [...prev, subscription]);
    
    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      setSubscriptions(prev => prev.filter(sub => sub !== subscription));
    };
  }, []);

  // Clean up subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptions.forEach(subscription => {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        }
      });
    };
  }, [subscriptions]);

  // Get file URL from storage
  const getFileUrl = useCallback((bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || null;
  }, []);

  return {
    loading,
    select,
    insert,
    update,
    remove,
    uploadFile,
    deleteFile,
    callRpc,
    batchInsert,
    joinTables,
    subscribe,
    getFileUrl,
    supabase // Expose the raw client for advanced use cases
  };
};

export default useSupabase;