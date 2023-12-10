// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {brand, imageUrl, price, rating, title} = product

  return (
    <li className="similar-list-styles-container">
      <img className="similar-images" src={imageUrl} alt="similar product" />
      <p className="similar-products-title">{title}</p>
      <p className="similar-products-brand">by {brand}</p>

      <div className="similar-rating-container">
        <p className="similar-product-price">Rs {price}</p>
        <button className="similar-star-button" type="button">
          {rating}
          <img
            className="similar-star-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </button>
      </div>
    </li>
  )
}
export default SimilarProductItem
