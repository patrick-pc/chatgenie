import { createContext, useContext, useState } from 'react'

const Characters = createContext({
  characters: [],
  setCharacters: (character: any) => {},
})

export const useCharactersContext = () => {
  return useContext(Characters)
}

export const CharactersProvider = ({ children }: { children: any }) => {
  const [characters, setCharacters] = useState([])

  return <Characters.Provider value={{ characters, setCharacters }}>{children}</Characters.Provider>
}
