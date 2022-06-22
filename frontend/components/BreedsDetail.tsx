import { Component } from 'react';
import { ResponseError } from 'superagent';
import { v4 as uuidv4 } from 'uuid';

import every from 'lodash/every';
import isArray from 'lodash/isArray';
import throttle from 'lodash/throttle';

import { BreedsDetailThumb, LoadingView } from '@/components';
import { IErrorInfo } from '@/types';
import {
  getScrollY,
  getDocHeight,
  parseErrorResponse,
  request,
} from '@/utils';


interface Props {
  slug: string;
}

interface State {
  imageUrls: string[];
  limit: number;
  offset: number;
  isRetrieving: boolean;
  errorRetrieve: IErrorInfo;
}

export default class BreedsDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      imageUrls: [],
      limit: 16,
      offset: 0,
      isRetrieving: true,
      errorRetrieve: {},
    };

    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.onScroll = throttle(this.onScroll.bind(this), 1000, {
      trailing: true,
    });
  }

  async handleRetrieve() {
    this.setState({ isRetrieving: true, errorRetrieve: {} });

    try {
      const res = await request.get('/breeds/' + this.props.slug);

      if (
        isArray(res.body)
        && every(res.body, (url) => typeof url === 'string')
      ) {
        const imageUrls: string[] = res.body;
        return this.setState({ imageUrls });
      }

      const error = new Error() as ResponseError;
      res.body = { detail: 'Invalid response body.' };
      error.response = res;
      throw error;
    } catch (err: any) {
      console.error(err);
      const errorRetrieve = parseErrorResponse(err?.response?.body, []);
      this.setState({ errorRetrieve });
    } finally {
      this.setState({ isRetrieving: false });
    }
  }

  onScroll() {
    const { imageUrls, limit, isRetrieving, errorRetrieve } = this.state;

    if (
      !imageUrls.length
      || imageUrls.length <= limit
      || isRetrieving
      || !!errorRetrieve.detail?.length
    ) return;

    if (getScrollY() + window.innerHeight >= getDocHeight() - 15) {
      this.setState({ limit: limit + 16 });
    }
  }

  componentDidMount() {
    this.handleRetrieve();

    if (this.state.imageUrls.length) {
      window.addEventListener('scroll', this.onScroll);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.imageUrls.length && this.state.imageUrls.length) {
      window.addEventListener('scroll', this.onScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const {
      imageUrls,
      limit,
      offset,
      isRetrieving,
      errorRetrieve,
    } = this.state;

    const hasUrls = !!imageUrls?.length && isArray(imageUrls);
    const hasError = !!errorRetrieve?.detail?.length;

    return isRetrieving ? <LoadingView className='LoadingView--detail' /> : (
      <div className='BreedsDetail'>
        {!hasError && hasUrls && (
          <ul className='BreedsDetail-list'>
            {imageUrls.slice(offset, limit).map((url) => {
              const id = uuidv4();

              return (
                <li className='BreedsDetail-list-item' key={id}>
                  <BreedsDetailThumb imageUrl={url} id={id} />
                </li>
              );
            })}
          </ul>
        )}
        {!hasError && !hasUrls && (
          <p className='BreedsDetail-message'>
            We can&apos;t find any images of this breed at the moment!
          </p>
        )}
        {errorRetrieve?.detail?.map(e => (
          <p key={e.id} className='BreedsDetail-error'>{e.msg}</p>
        ))}
        {imageUrls.length <= limit && (
          <p className='BreedsDetail-message'>End of results</p>
        )}
      </div>
    );
  }
}
