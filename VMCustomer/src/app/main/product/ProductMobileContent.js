import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import appConfig from "app/configs/appConfig";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import _ from "lodash";

const StyledTopContainer = styled("div")(`
  display: flex;
  flex-direction: row;
  width: 100%;
`);

const StyledProductContainer = styled("div")(`
    display: flex;
    padding: 5px;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    width: 100%;
  `);

const StyledCategoryList = styled("div")(({ theme, isVisible }) => `
  display: flex;
  width: 250px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  position: absolute;
  z-index: 200;
  margin-left: ${isVisible ? '-20px' : '-245px'}; // Adjust based on the open state
  transition: margin-left 0.3s ease;

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    background: white;
    padding: 14px;
    box-shadow: 0px 12px 18.9px 0px rgba(0, 0, 0, 0.25);
    
    .category-item {
      display: flex;
      justify-content: center;
      align-items: center;
      
      .category-item-image {
        position: relative;
        overflow: hidden;
      }

      .category-item-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Museo Sans', sans-serif;
        font-size: 20px;
      }
    }
  }

  .list-trigger-btn {
  }
`);

const StyledSearchBox = styled("div")(`
    border-radius: 5.037px;
    background: #FFF;
    box-shadow: 0px 3px 5.9px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    padding: 0px 8px;
    align-items: center;
    gap: 9.5px;
    justify-content: center;
    width: 85%;

    .search-input {
      color: #999;
      text-align: left;
      font-family: Museo Sans;
      font-size: 16.789px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
      width: 100%;
    }

    div {
      width: 0.56px;
      height: 34.138px;
      background: #999;
    }
  `);

const StyledProductList = styled("div")(`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1%;
    align-self: stretch;
    justify-content: center;
    width: 100%;

    .product-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 2%;
      flex: 1 0 0;
      align-self: stretch;
      width: 100%;

      .product-item {
        padding: 10px;
        display: flex;
        flex-direction: column;
        height: 190px;
        flex: 0 0 49%;
  
        .product-item-content {
          display: flex;
          align-self: stretch;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
    
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
          background: linear-gradient(180deg, #FCFEFF 0%, rgba(252, 254, 255, 0.00) 100%);
          box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
          backdrop-filter: blur(10px);
          gap: 6px;
    
          img {
            width: auto;
            height: 80px;
            flex-shrink: 0;
          }
    
          .title {
            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            letter-spacing: -1.36px;
          }
        }
  
        .product-item-category {
          background: #E9E8EE;
          position: relative;
          display: inline-block;
          color: #000;
          text-align: center;
          font-family: Museo Sans;
          border-bottom-right-radius: 4px;
          border-bottom-left-radius: 4px;

          .gradient-border {
            background: linear-gradient(180deg, #ededed 50%, #cbcaca 100%);
            position: absolute;
            top: 0px;
            left: -0.3px;
            right: -0.3px;
            bottom: -0.6px;
            z-index: -1;
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
          }
        }
      }
    }
  `);

const StyledMapProductButton = styled(motion.button)(({ theme }) => ({
  display: "inline-flex",
  padding: "5.859px 10.155px",
  justifyContent: "center",
  alignItems: "center",
  gap: "3.906px",
  borderRadius: "3.906px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "2vw",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-0.344px",
  width: "60%",
  height: "18px",
  cursor: "pointer",
  fontSize: "10px",
}));

const hoverAnimation = {
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.6)",
  backgroundColor: "#536A71",
  borderColor: "#536A71",
  transition: { duration: 0.2 }
};

const tapAnimation = {
  scale: 1.05
};

function ProductMobileContent(props) {
  const { ProductList, categoryStrings } = props;
  const { t } = useTranslation("ProductPage");
  const {i18n} = useTranslation();
  const navigate = useNavigate();

  const categoryListRef = useRef(null);

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(ProductList);
  const [categoryListTriggered, setCategoryListTriggered] = useState(false);
  const [rows, setRows] = useState([]);
  const productsPerRow = 2;

  const onClickViewDetails = (product_id) => {
    navigate("/product/detail/" + product_id);
  };

  const onSearchChanged = (event) => {
    const searchKeyword = event.target.value;
    const filteredList = ProductList.filter((product) =>
    i18n.language == "en"
    ? product.name.toLowerCase().includes(searchKeyword.toLowerCase()) 
    : product.name_de.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    setSearch(searchKeyword);
    setFilteredProducts(filteredList);
  };

  const onClickedAllItems = () => {
    setSearch("");
    setFilteredProducts(ProductList);
  };

  const onClickedCategoryItems = (category) => {
    const filteredList = ProductList.filter((product) =>
      product.category == category
    );
    setFilteredProducts(filteredList);
  }

  const toogleCategoryListNav = () => {
    setCategoryListTriggered(!categoryListTriggered);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryListRef.current && !categoryListRef.current.contains(event.target)) {
        setCategoryListTriggered(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryListRef]);

  useEffect(() => {
    const resultRows = [];
    for (let i = 0; i < filteredProducts.length; i += productsPerRow) {
      const rowProducts = filteredProducts.slice(i, i + productsPerRow);
      resultRows.push(rowProducts);
    }
    setRows(resultRows);

  }, [filteredProducts]);

  return (
    <StyledTopContainer>
      <StyledCategoryList isVisible={categoryListTriggered} ref={categoryListRef}>
        <div className="category-list">
          <div className="category-item" onClick={onClickedAllItems}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/all-items.png"
                alt={t('All')}
              />
              <div className="category-item-text">
                <p>{t('All')}</p>
              </div>
            </div>
          </div>
          <div className="category-item" onClick={() => { onClickedCategoryItems('ecig') }}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/ecig-item.png"
                alt={t('ECig')}
              />
              <div className="category-item-text">
                <p>{t('ECig')}</p>
              </div>
            </div>
          </div>
          <div className="category-item" onClick={() => { onClickedCategoryItems('snack') }}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/snack-item.png"
                alt={t('Snacks')}
              />
              <div className="category-item-text">{t('Snacks')}</div>
            </div>
          </div>

          <div className="category-item" onClick={() => { onClickedCategoryItems('drink') }}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/drink-item.png"
                alt={t('Drink')}
              />
              <div className="category-item-text">{t('Drink')}</div>
            </div>
          </div>
        </div>
        <div className="list-trigger-btn" onClick={toogleCategoryListNav}>
          <img
            src="assets/images/products/category-nav/mobile-category-nav-trigger-btn.png"
            alt="Snacks"
          />
        </div>
      </StyledCategoryList>
      <StyledProductContainer>
        <StyledSearchBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.2472 12.2767C8.68987 14.3249 4.94651 14.1637 2.5759 11.7931C0.0323184 9.24954 0.0323184 5.12558 2.5759 2.582C5.11947 0.0384213 9.24343 0.0384218 11.787 2.582C14.1576 4.95261 14.3188 8.69596 12.2706 11.2533L17.2454 16.2281C17.528 16.5107 17.528 16.9689 17.2454 17.2515C16.9628 17.5342 16.5046 17.5342 16.222 17.2515L11.2472 12.2767ZM3.59935 10.7697C1.62101 8.79132 1.62101 5.5838 3.59935 3.60546C5.57769 1.62712 8.78521 1.62712 10.7636 3.60546C12.7404 5.58235 12.7419 8.78661 10.7679 10.7653C10.7664 10.7667 10.765 10.7682 10.7635 10.7696C10.7621 10.7711 10.7606 10.7725 10.7592 10.774C8.78051 12.748 5.57624 12.7465 3.59935 10.7697Z"
              fill="#1A1A1A"
            />
          </svg>
          <div />
          <input className="search-input" placeholder={t("Search")} value={search} onChange={onSearchChanged} />
        </StyledSearchBox>
        <StyledProductList>
        {rows.map((row, rowIndex) => (
            <div className="product-row" key={rowIndex}>
              {row.map((product, index) => (
                <div className="product-item" key={index}>
                  <div className="product-item-content">
                    <img
                      src={`${appConfig.API_SERVER}file/download/${btoa(
                        product.thumbnail
                      )}`}
                      alt="product"
                    />
                    <div className="title">{i18n.language == "en"? product.name: product.name_de}</div>
                    <StyledMapProductButton
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                      onClick={() => onClickViewDetails(product._id)}
                    >
                      {t('Detail')}
                    </StyledMapProductButton>
                  </div>
                  <div className="product-item-category">
                    <div className="gradient-border"></div>
                    {categoryStrings[product.category]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </StyledProductList>
      </StyledProductContainer>
    </StyledTopContainer>
  );
}

export default ProductMobileContent;
