import logo from './logo.svg';
import router from './router';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer.jsx'
import './i18n'
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
const ScrollToTop = props => {
  const { pathname } = useLocation()
  useEffect(() => {
    document.body.scrollTo(0, 0)
    let the_path = pathname == '/'?'/home':pathname
    document.title = 'Ostrich'+the_path.replace(the_path.charAt(1), the_path.charAt(1).toUpperCase())
  }, [pathname]);
  return props.children;
}
function App() {
  const { pathname } = useLocation()
  //不显示尾部
  const FooterList = ['/airdrop','/invite', '/quest']
  return (
    <ScrollToTop>
        <div className="App">
          <Header />
          <Routes>
            {
              router.map(item => {
                return (
                  <Route key={item.path} path={item.path} exact={true} element={item.component} />
                )
              })
            }
          </Routes>
          {!FooterList.includes(pathname) && <Footer />}
        </div>
      </ScrollToTop>
  );
}

export default App;
