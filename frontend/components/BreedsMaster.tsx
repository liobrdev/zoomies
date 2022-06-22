import { Component, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import isArray from 'lodash/isArray';
import throttle from 'lodash/throttle';

import {
  BreedsMasterEmpty,
  BreedsMasterRetrieve,
  BreedsMasterThumb,
} from '@/components';
import { AppDispatch, AppState, IErrorInfo } from '@/types';
import { getScrollY, getDocHeight } from '@/utils';


class BreedsMaster extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onScroll = throttle(this.onScroll.bind(this), 1000, {
      trailing: true,
    });

    this.handleEsc = this.handleEsc.bind(this);
  }
  
  handleEsc(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      if (this.props.master.searchBarOn) this.props.searchBarClose();
    }
  }

  onScroll() {
    const {
      limit,
      offset,
      isRetrieving,
      hasMore,
      errorRetrieve,
      searchBarOn,
      searchBreed,
    } = this.props.master;

    if (
      !!errorRetrieve.detail?.length
      || isRetrieving
      || !hasMore
      || (searchBarOn && searchBreed)
    ) return;

    if (getScrollY() + window.innerHeight >= getDocHeight() - 15) {
      this.props.setLimitOffset(limit + 16, offset);
    }
  }

  handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.props.masterReset();
  }

  componentDidMount() {
    if (this.props.master.breeds.length) {
      window.addEventListener('scroll', this.onScroll);
    }

    window.addEventListener('keydown', this.handleEsc);
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.master.breeds.length && this.props.master.breeds.length) {
      window.addEventListener('scroll', this.onScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.handleEsc);
  }

  render() {
    const {
      breeds,
      isRetrieving,
      hasMore,
      errorRetrieve,
      searchBarOn,
      searchBreed,
    } = this.props.master;

    const hasBreeds = !!breeds?.length && isArray(breeds);
    const hasError = !!errorRetrieve?.detail?.length;

    return (
      <div className='BreedsMaster'>
        <BreedsMasterRetrieve />
        {!hasError && hasBreeds && (
          <ul className='BreedsMaster-list'>
            {breeds.map((breed) => (
              <li className='BreedsMaster-list-item' key={breed.breed_name}>
                <BreedsMasterThumb { ...breed } />
              </li>
            ))}
          </ul>
        )}
        {!hasError && !hasBreeds && <BreedsMasterEmpty />}
        {errorRetrieve?.detail?.map(e => (
          <p key={e.id} className='BreedsMaster-error'>{e.msg}</p>
        ))}
        {isRetrieving && <p className='BreedsMaster-message'>Loading...</p>}
        {!isRetrieving && !hasMore && !(searchBarOn && searchBreed) && (
          <p className='BreedsMaster-message'>End of results</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  master: state.master,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  startRetrieveMaster: () => {
    dispatch({ type: 'START_RETRIEVE_MASTER' });
  },
  stopRetrieveMaster: () => {
    dispatch({ type: 'STOP_RETRIEVE_MASTER' });
  },
  setLimitOffset: (limit: number, offset: number) => {
    dispatch({ type: 'SET_LIMIT_OFFSET', limit, offset });
  },
  searchBarClose: () => {
    dispatch({ type: 'MASTER_SEARCHBAR_CLOSE' });
  },
  masterError: (errorRetrieve: IErrorInfo) => {
    dispatch({ type: 'MASTER_ERROR', errorRetrieve });
  },
  masterReset: () => {
    dispatch({ type: 'MASTER_RESET' });
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(BreedsMaster);
