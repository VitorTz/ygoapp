import React from 'react';
import { ImageDB, Card, UserDB, LimitedCards } from './types';
import { Session } from '@supabase/supabase-js';


interface GlobalContextProps {
    user: UserDB | null
    session: Session | null
    profileIcons: ImageDB[]
    relatedCards: Map<string, Card[]>
    userCards: Map<number, Card>
    limitedCards: LimitedCards | null
}

export const GlobalContext = React.createContext<GlobalContextProps>({
  user: null,
  session: null,
  profileIcons: [],
  relatedCards: new Map<string, Card[]>(),
  userCards: new Map<number, Card>(),
  limitedCards: null
});