import React, { Component } from 'react';

import Link from 'next/link';

import { LoadingView } from '@/components';
import { IBreed as Props } from '@/types';


interface State {
  imageLoaded: boolean;
  imageError: boolean;
}

export default class BreedsMasterThumb extends Component<Props, State> {
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
    const name = this.props.breed_name;
    const image =
      document.getElementById(`img_${name}`) as HTMLImageElement | null;

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
            `<img id='img_${this.props.breed_name}' />` +
            ' did not load within a reasonable time frame!'
          );
        } else recursiveCheck();
      }, 250);
    };

    recursiveCheck();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.imageLoaded && this.state.imageLoaded) {
      const { breed_name, thumbnail_url } = this.props;

      const thumb = document.getElementById(
        'thumb_' + breed_name
      ) as HTMLLinkElement | null;

      if (thumb) {
        thumb.style.backgroundImage = `url(${encodeURI(thumbnail_url)})`;
      }
    }
  }

  componentWillUnmount() {
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
  }

  render() {
    const { breed_name, thumbnail_url } = this.props;
    const { imageLoaded, imageError } = this.state;

    return (
      <Link href={`/breed/${breed_name}`}>
        <a className='BreedsMasterThumb' id={'thumb_' + breed_name}>
          {!imageLoaded && !imageError && (
            <LoadingView className='LoadingView--thumb' />
          )}
          <img
            className={
              `BreedsMasterThumb-image${imageLoaded ? ' is-loaded' : ''}`
            }
            id={'img_' + breed_name}
            alt={breed_name}
            src={thumbnail_url}
          />
          {!!imageLoaded && (
            <span className='BreedsMasterThumb-text'>{breed_name}</span>
          )}
        </a>
      </Link>
    );
  }
}
