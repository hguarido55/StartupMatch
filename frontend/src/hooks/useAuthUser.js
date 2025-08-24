import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    refetchOnWindowFocus: false, // Cambio para que la página no haga 'refresh' cada vez
  }); 

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
}

export default useAuthUser