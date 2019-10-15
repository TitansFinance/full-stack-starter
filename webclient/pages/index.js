import withApollo from '../constructors/apollo/withApollo'
import App from '../components/App'
import Header from '../components/Header'
import ExampleComponent from '../components/ExampleComponent'

export default withApollo(({}) => {
  return (
    <App>
      <Header />
      <ExampleComponent />
    </App>
  )
})
