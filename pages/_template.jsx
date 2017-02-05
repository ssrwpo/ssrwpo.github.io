import React from 'react'
import { Link } from 'react-router'
import { Container, Grid, Span } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import includes from 'underscore.string/include'
import { colors, activeColors } from 'utils/colors'

import typography from 'utils/typography'
import { config } from 'config'

// Import styles.
import 'css/main.css'
import 'css/github.css'

const { rhythm, adjustFontSizeTo } = typography

const NavLink = ({ active, href, name }) => (
  <Link
    to={prefixLink(href)}
    style={{
      background: active ? activeColors.bg : colors.bg,
      color: active ? activeColors.fg : colors.fg,
      float: 'right',
      textDecoration: 'none',
      paddingLeft: rhythm(1/2),
      paddingRight: rhythm(1/2),
      paddingBottom: rhythm(3/4),
      marginBottom: rhythm(-1),
      paddingTop: rhythm(1),
      marginTop: rhythm(-1),
    }}
  >
    {name}
  </Link>
);

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.object,
    }
  },
  render () {
    return (
      <div>
        <div
          style={{
            background: colors.bg,
            color: colors.fg,
            marginBottom: rhythm(1.5),
          }}
        >
          <Container
            style={{
              maxWidth: 960,
              paddingLeft: rhythm(3/4),
            }}
          >
            <Grid
              columns={12}
              style={{
                padding: `${rhythm(3/4)} 0`,
              }}
            >
              <Span
                columns={8}
                style={{
                  height: 24, // Ugly hack. How better to constrain height of div?
                }}
              >
                <Link
                  to={prefixLink('/')}
                  style={{
                    textDecoration: 'none',
                    color: colors.fg,
                    fontSize: adjustFontSizeTo('25.5px').fontSize,
                  }}
                >
                  {config.siteTitle}
                </Link>
              </Span>
              <Span columns={2}>
                <NavLink
                  active={includes(this.props.location.pathname, '/ssr/')}
                  href="/ssr/" name="SSR"
                />
              </Span>
              <Span columns={2} last>
                <NavLink
                  active={includes(this.props.location.pathname, '/uglifyjs2/')}
                  href="/uglifyjs2/" name="UglifyJS2"
                />
              </Span>
            </Grid>
          </Container>
        </div>
        <Container
          style={{
            maxWidth: 960,
            padding: `${rhythm(1)} ${rhythm(3/4)}`,
            paddingTop: 0,
          }}
        >
          {this.props.children}
        </Container>
      </div>
    )
  },
})
