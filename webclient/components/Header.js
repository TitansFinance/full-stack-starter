import Link from 'next/link'
import { withRouter } from 'next/router'
import { withTranslation } from '../constructors/next-i18next'
import LanguageSelect from './LanguageSelect'

const Header = ({ t, router: { pathname } }) => {
  return (
    <header>
      <div>
        <Link href='/'>
          <a className={pathname === '/' ? 'is-active' : ''}>{t('Dashboard')}</a>
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LanguageSelect />
      </div>
      <style jsx>{`
        header {
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
        }
        a {
          font-size: 14px;
          margin-right: 15px;
          text-decoration: none;
        }
        .is-active {
          text-decoration: underline;
        }
      `}</style>
    </header>
  )
}

export default withRouter(withTranslation()(Header))
