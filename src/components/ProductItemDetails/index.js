import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem/index'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getDataUpdate = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      console.log(response)
      const data = await response.json()
      console.log(data)
      const updatedData = this.getDataUpdate(data)
      const similarDataProducts = data.similar_products.map(each =>
        this.getDataUpdate(each),
      )
      this.setState({
        productData: updatedData,
        similarProducts: similarDataProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncreament = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderSelectedProducts = () => {
    const {productData, similarProducts, quantity} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <>
        <div className="product-sub-container">
          <img className="product-img" src={imageUrl} alt="product" />
          <div className="details-container">
            <h1 className="product-item-main-heading">{title}</h1>
            <p className="price-styles">Rs {price}</p>
            <div className="star-ratings">
              <button className="star-button" type="button">
                <p>{rating}</p>
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </button>
              <p className="rating-text-styles">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="side-answers">
              <span className="side-headings">Available:</span> {availability}{' '}
            </p>
            <p className="side-answers">
              <span className="side-headings">Brand: </span>
              {brand}
            </p>
            <hr className="line" />
            <div className="increase-container">
              <button
                onClick={this.onDecrement}
                type="button"
                className="in-de-button"
                data-testid="minus"
              >
                <BsDashSquare className="decrease-icon" />
              </button>
              <p className="quantity-styles">{quantity}</p>
              <button
                onClick={this.onIncreament}
                className="in-de-button"
                type="button"
                data-testid="plus"
              >
                <BsPlusSquare className="increase-icon" />
              </button>
            </div>
            <div className="add-cart-button">
              <button className="add-button" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1 className="similar-text-styles">Similar Products</h1>

        <ul className="ul-list-products">
          {similarProducts.map(each => (
            <SimilarProductItem product={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  onRedirectToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailurView = () => (
    <div className="failure-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button
        onClick={this.onRedirectToProducts}
        className="failure-button"
        type="button"
      >
        {' '}
        Continue Shopping
      </button>
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailurView()
      case apiStatusConstants.success:
        return this.renderSelectedProducts()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="products-item-main-container">
          {this.renderAllProducts()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
