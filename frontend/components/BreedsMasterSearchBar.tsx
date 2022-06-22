import { FormEvent, MouseEvent } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks';

import { CloseIcon, Input, SearchIcon } from './';


export default function BreedsMasterSearchBar() {
  const {
    searchBarOn,
    searchBreed,
  } = useAppSelector((state) => state.master);
  const dispatch = useAppDispatch();

  const handleShow = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({ type: 'MASTER_SEARCHBAR_SHOW' });
  };

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({ type: 'MASTER_SEARCHBAR_CLOSE' });
  };

  const handleInput = () => (e: FormEvent<HTMLInputElement>) => {
    const searchBreed = (e.target as HTMLInputElement).value;
    dispatch({ type: 'MASTER_SEARCHBAR_INPUT', searchBreed });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const searchBar = (
    <form
      className='BreedsMasterSearchBar-form'
      id='formSearchBar'
      onSubmit={handleSubmit}
    >
      <Input
        className='BreedsMasterSearchBar-form-input'
        name='title'
        type='text'
        value={searchBreed}
        placeholder='Search'
        onChange={handleInput()}
        disabled={!searchBarOn}
        required
        autoFocus
      />
      <div className='CloseIcon-container'>
        <CloseIcon type='button' onClick={handleClose} />
      </div>
    </form>
  );

  const buttonShow = (
    <div className='SearchIcon-container'>
      <SearchIcon type='button' onClick={handleShow} />
    </div>
  );

  return (
    <div className={`BreedsMasterSearchBar${searchBarOn ? ' is-on' : ''}`}>
      {searchBarOn ? searchBar : buttonShow}
    </div>
  );
}