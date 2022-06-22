import React, { Component, ReactNode } from 'react';
import throttle from 'lodash/throttle';

import Head from 'next/head';
import { NextRouter, withRouter } from 'next/router';


const description = 'Zoomies Challenge integrating the Dog API.';

class RootComponent extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleResize = throttle(this.handleResize.bind(this), 200, {
      leading: true,
    });
  }

  handleResize() {
    document.body.style.height = window.innerHeight + 'px';
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            sizes="32x32"
            href="/favicon.ico"
          />
          <meta name="msapplication-TileColor" content="#0492C2" />
          <meta name="theme-color" content="#0492C2" />
          <meta itemProp="name" content="Zoomies Challenge" />
          <meta itemProp="description" content={description} />
          <meta name="description" content={description} />
          <meta property="og:title" content="Zoomies Challenge" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://zoomies.liobr.dev" />
          <meta property="og:description" content={description} />
        </Head>
        <div className='SiteContainer'>
          {this.props.children}
        </div>
      </>
    );    
  }
}

interface Props {
  children: ReactNode;
  router: NextRouter;
}

export default withRouter(RootComponent);
