import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '@/types';


class BreedsMasterEmpty extends Component<Props, State> {
  private loadingTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = { messageOn: false };
    this.loadingTimeout = undefined;
  }

  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ messageOn: true });
    }, 500);
  }

  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
  }

  render() {
    const { searchBarOn } = this.props;
    const { messageOn } = this.state;

    return messageOn ? (
      <p className='BreedsMaster-message'>
        {searchBarOn ? 'No matching dog breeds found.' : (
          <>
            We can&apos;t find any zoomies at the moment!
          </>
        )}
      </p>
    ) : null;
  }
}

const mapStateToProps = (state: AppState) => ({
  searchBarOn: state.master.searchBarOn,
});

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

interface State {
  messageOn: boolean;
}

export default connector(BreedsMasterEmpty);
