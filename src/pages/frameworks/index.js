import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import Columns from '../../components/Columns';
import Column from '../../components/Column';
import Card from '../../components/Card';
import CardImage from '../../components/CardImage';
import CardFooter from '../../components/CardFooter';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout
      title={translate({
        message: 'home.title',
      })}
      description={translate({
        message: 'home.description',
      })}>
      <main style={{paddingTop: '1rem'}}>
        <Columns>
          <Column><h1>Поддерживаемые фреймворки</h1></Column>
        </Columns>
        <Columns>
            <Column className="col--3">
                <Card>
                    <CardImage
                    cardImageUrl='/img/frameworks/zb-vue3.png'
                    />
                    <CardFooter style={{ backgroundColor: 'var(--ifm-navbar-background-color)' , color:'black'}} className='text--center'> 
                    <div className='button-group button-group--block'>
                        {/* <button className='button button--success'>Like</button> */}
                        <Link as={'button'} href="docs/frameworks/zebrains-lssr-vue" className='button button--primary'>Документация</Link>
                    </div>
                    </CardFooter> 
                </Card>
            </Column>
            <Column className="col--3">
                <Card>
                    <CardImage
                    cardImageUrl='/img/frameworks/zb-react.png'
                    />
                    <CardFooter style={{ backgroundColor: 'var(--ifm-navbar-background-color)' , color:'black'}} className='text--center'> 
                    <div className='button-group button-group--block'>
                        {/* <button className='button button--success'>Like</button> */}
                        <Link as={'button'} href="#" className='button button--secondary'>В разработке</Link>
                    </div>
                    </CardFooter> 
                </Card>
            </Column>
        </Columns>
      </main>
    </Layout>
  );
}
