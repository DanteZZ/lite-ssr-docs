import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import Columns from '../../components/Columns';
import Column from '../../components/Column';
import Card from '../../components/Card';
import CardFooter from '../../components/CardFooter';
import Link from '@docusaurus/Link';
import clsx from 'clsx'; 
import "./index.css";

function Frameworks() {
  return <main style={{paddingTop: '1rem'}}>
  <Columns>
    <Column><h1>Поддерживаемые фреймворки/библиотеки</h1></Column>
  </Columns>
  <Columns>
      <Column className="col--3">
        <Card>
          <img className={clsx('card__image', "zb-vue-logo")} alt="Vue logo by ZB"/>
          <CardFooter style={{ backgroundColor: 'var(--ifm-navbar-background-color)' , color:'black', paddingTop: '.5rem'}} className='text--center'> 
            <div className='button-group button-group--block' >
              {/* <button className='button button--success'>Like</button> */}
              <Link as={'button'} href="/docs/renderers/zb-vue" className='button button--primary'>Документация</Link>
            </div>
          </CardFooter> 
        </Card>
      </Column>
      <Column className="col--3">
        <Card>
          <img className={clsx('card__image', "zb-react-logo")} alt="React logo by ZB"/>
          <CardFooter style={{ backgroundColor: 'var(--ifm-navbar-background-color)' , color:'black', paddingTop: '.5rem'}} className='text--center'> 
          <div className='button-group button-group--block'>
            {/* <button className='button button--success'>Like</button> */}
            <Link as={'button'} href="#" className='button button--secondary'>В разработке</Link>
          </div>
          </CardFooter> 
        </Card>
      </Column>
  </Columns>
</main>
}

export default function FrameworksLayout() {
  return (
    <Layout
      title={translate({
        message: 'home.title',
      })}
      description={translate({
        message: 'home.description',
      })}>
      <Frameworks/>
    </Layout>
  );
}
