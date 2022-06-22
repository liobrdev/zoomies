import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import Head from 'next/head';
import Link from 'next/link';
import { withRouter, NextRouter } from 'next/router';

import { BreedsMaster, BreedsMasterSearchBar } from '@/components';
import { AppState, IBreadcrumbListItem } from '@/types';


class Home extends Component<Props> {
  render() {
    const breadcrumbList: IBreadcrumbListItem[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://zoomies.liobr.dev"
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
          <title>Home &mdash; Zoomies Challenge</title>
          <script type="application/ld+json">{breadcrumb}</script>
        </Head>
        <main className='Page Page--home'>
          <BreedsMasterSearchBar />
          <section className='Section Section--welcome'>
            <div className='Welcome'>
              <h3><b>Zoomies</b> Challenge</h3>
              <p>
                Find pictures of almost any breed with the&nbsp;
                <Link href='https://dog.ceo/dog-api/'>
                  <a target='_blank' rel='noreferrer'>Dog API &#8594;</a>
                </Link>
              </p>
            </div>
          </section>
          <section className='Section Section--master'>
            <BreedsMaster />
          </section>
        </main>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  breeds: state.master.breeds,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  router: NextRouter;
}

export default withRouter(connector(Home));
