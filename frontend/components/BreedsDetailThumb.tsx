import React, { Component } from 'react';
import Link from 'next/link';

import { LoadingView } from '@/components';


interface Props {
  id: string;
  imageUrl: string;
}

interface State {
  imageLoaded: boolean;
  imageError: boolean;
}

export default class BreedsDetailThumb extends Component<Props, State> {
  private loadingTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);

    this.state = {
      imageLoaded: false,
      imageError: false,
    };

    this.isImageLoaded = this.isImageLoaded.bind(this);
    this.loadingTimeout = undefined;
  }

  isImageLoaded() {
    const id = this.props.id;
    const image =
      document.getElementById('img_' + id) as HTMLImageElement | null;

    return !!image && image.complete && image.naturalHeight !== 0;
  }

  componentDidMount() {
    if (this.isImageLoaded()) return this.setState({ imageLoaded: true });

    let counter = 240;

    const recursiveCheck = () => {
      this.loadingTimeout = setTimeout(() => {
        --counter;

        if (this.isImageLoaded()) this.setState({ imageLoaded: true });
        else if (counter === 0) {
          this.setState({ imageError: true });
          console.error(
            `<img id='img_${this.props.id}' />` +
            ' did not load within a reasonable time frame!'
          );
        } else recursiveCheck();
      }, 250);
    };

    recursiveCheck();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.imageLoaded && this.state.imageLoaded) {
      const { id, imageUrl } = this.props;

      const thumb =
        document.getElementById('thumb_' + id) as HTMLLinkElement | null;

      if (thumb) thumb.style.backgroundImage = `url(${encodeURI(imageUrl)})`;
    }
  }

  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
  }

  render() {
    const { id, imageUrl } = this.props;
    const { imageLoaded, imageError } = this.state;

    return (
      <Link href={imageUrl}>
        <a
          className='BreedsDetailThumb'
          id={'thumb_' + id}
          target='_blank'
          rel='noreferrer'
        >
          {!imageLoaded && !imageError && (
            <LoadingView className='LoadingView--thumb' />
          )}
          <img
            className={
              `BreedsDetailThumb-image${imageLoaded ? ' is-loaded' : ''}`
            }
            id={'img_' + id}
            alt={imageUrl}
            src={imageUrl}
          />
        </a>
      </Link>
    );
  }
}
