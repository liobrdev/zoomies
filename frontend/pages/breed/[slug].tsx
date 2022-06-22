import React, { Component, MouseEvent } from 'react';

import Head from 'next/head';
import { withRouter, NextRouter } from 'next/router';

import { BreedsDetail, LeftArrowIcon } from '@/components';
import { IBreadcrumbListItem } from '@/types';


class Breed extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { slug: '' };
    this.handleBack = this.handleBack.bind(this);
  }

  handleBack(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.props.router.push('/');
  };

  componentDidMount() {
    if (typeof this.props.router.query.slug === 'string') {
      this.setState({ slug: this.props.router.query.slug });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.router.query !== this.props.router.query
      && typeof this.props.router.query.slug === 'string'
    ) {
      this.setState({ slug: this.props.router.query.slug });
    }
  }

  render() {
    const { slug } = this.state;

    let breedName = slug;
    let title = 'Zoomies Challenge';
    
    if (breedName) {
      breedName = breedName.charAt(0).toUpperCase() + breedName.slice(1);
      title = breedName + ' — ' + title;
    }

    const breadcrumbList: IBreadcrumbListItem[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://zoomies.liobr.dev"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: `https://zoomies.liobr.dev/breed/${slug}`
      }
    ];

    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbList
    });

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name='robots' content='noindex, nofollow' />
          <script type="application/ld+json">{breadcrumb}</script>
        </Head>
        <main className='Page Page--detail'>
          <div className='LeftArrowIcon-container'>
            <LeftArrowIcon
              onClick={this.handleBack}
              src='/left-arrow-wh.png'
              type='button'
              title='Back'
            />
          </div>
          <section className='Section Section--welcome'>
            <div className='Welcome'><h3>{breedName}</h3></div>
          </section>
          <section className='Section Section--detail'>
            {!!slug && <BreedsDetail slug={slug} />}
          </section>
        </main>
      </>
    );
  }
}

interface Props {
  router: NextRouter;
}

interface State {
  slug: string;
}

export default withRouter(Breed);
