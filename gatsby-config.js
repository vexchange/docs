const menu = require('./src/utils/menu')

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  siteMetadata: {
    title: `Vexchange`,
    description: `Automated liquidity protocol on VeChain`,
    author: `@Vexchange`,
    menulinks: menu,
    siteUrl: `https://vexchange.io`,
    repository: `https://github.com/VeChainDEXCode`,
    commit: process.env.NOW_GITHUB_COMMIT_SHA || `master`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: process.env.AWS_S3_BUCKET || 'NOT_SPECIFIED',
        protocol: 'https',
        hostname: 'uniswap.org',
        acl: null
      }
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://vexchange.io`
      }
    },
    {
      resolve: 'gatsby-plugin-replace-path',
      options: {
        pattern: /\d+-/g,
        replacement: ''
      }
    },
    `re-slug`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `docs`,
        path: `${__dirname}/src/pages/docs/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `faq`,
        path: `${__dirname}/src/pages/faq/`
      }
    },
    {
      resolve: `gatsby-plugin-page-creator`,
      options: {
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-twitter`,
    `gatsby-plugin-instagram-embed`,
    `gatsby-plugin-smoothscroll`,
    `gatsby-plugin-styled-components`,
    `gatsby-background-image`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/
        }
      }
    },
    'gatsby-remark-reading-time',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          default: require.resolve('./src/layouts'),
          docs: require.resolve(`./src/layouts/docs`),
          faq: require.resolve(`./src/layouts/faq`)
        },
        remarkPlugins: [require(`remark-math`)],
        rehypePlugins: [require(`rehype-katex`)],
        gatsbyRemarkPlugins: [
          `gatsby-remark-embedder`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-autolink-headers`,
          // `gatsby-remark-check-links`,
          {
            resolve: `gatsby-remark-twitter-cards`,
            options: {
              title: 'Vexchange', // website title
              separator: '|', // default
              author: '@vexchange',
              background: require.resolve('./static/images/twitter_card_bg.jpg'), // path to 1200x630px file or hex code, defaults to black (#000000)
              fontColor: '#FF3093', // defaults to white (#ffffff)
              fontStyle: 'sans-serif', // default
              titleFontSize: 124, // default
              fontFile: require.resolve('./static/fonts/GT-Haptik-Regular.ttf') // will override fontStyle - path to custom TTF font
            }
          },
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              showCaptions: true
            }
          }
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      }
    },
    'gatsby-plugin-eslint',
    {
      resolve: `gatsby-plugin-algolia-docsearch-appid`,
      options: {
        apiKey: '8962240e69e6d23a88432f501c115470',
        indexName: 'uniswap_v2_docs',
        appId: 'VZ0CVS8XCW',
        inputSelector: 'blank' // use dummy selector to avoid double render
      }
    },
    {
      resolve: 'gatsby-plugin-emoji-favicon',
      options: {
        emoji: '🔥'
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ]
}
