import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import appConfig from "app/configs/appConfig";
import { motion } from "framer-motion";

const StyledTopContainer = styled("div")(`
    display: flex;
    flex-direction: column;
`);

const StyledToolbar = styled("div")(`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40%;
    gap: 6px;
`);

const StyledDevider = styled("div")(`
    width: 3.5px;
    height: 100%;
    background: #c4e5e5;
    border-radius: 15px;
    margin-top: 8px;
`);

const StyledCategoryList = styled("div")(`
    width: 280px;

    .category-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8px;
      
      .category-item-image {
        position: relative;
        overflow: hidden;
        transition: transform 0.3s ease;
      }

      .category-item-image:hover {
        transform: scale(1.05);
      }

      .category-item-image:active {
        transform: scale(1);
      }

      .category-item-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: Museo Sans;
        font-size: 20px;
      }
    }
  `);

const StyledContentDiv = styled("div")(`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    margin-top: 50px;
    gap: 11px;
`);

const StyledSearchBox = styled("div")(`
    border-radius: 9px;
    background: #FFF;
    box-shadow: 0px 3px 5.9px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    padding: 0px 15px;
    align-items: center;
    gap: 17px;
    align-self: stretch;
    width: 1150px;
    margin-left: 304px;

    .search-input {
      color: #999;
      text-align: left;
      font-family: Museo Sans;
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -1.2px;
      width: 100%;
    }

    div {
      width: 1px;
      height: 61px;
      background: #999;
    }
  `);

const StyledProductList = styled("div")(`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
    align-self: stretch;
    width: 1150px;
    margin-top: 8px;
    
    .product-row {
      display: flex;
      justify-content: flex-start;
      gap: 5%;
      flex: 1 0 0;
      align-self: stretch;

      .product-item {
        display: flex;
        flex-direction: column;
        width: 100%;
        flex: 0 0 30%;

        .product-item-content {
          display: flex;
          padding: 10px;
          gap: 9px;
          height: 250px;
          align-self: stretch;
          box-shadow: 5px 8px 11px 0px rgba(0, 0, 0, 0.25);
          flex-direction: column;
          justify-content: center;
          align-items: center;
  
          border-top-right-radius: 9px;
          border-top-left-radius: 9px;
          background: linear-gradient(180deg, #FCFEFF 0%, rgba(252, 254, 255, 0.00) 100%);
          box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
          backdrop-filter: blur(10px);
  
          img {
            width: auto;
            height: 132px;
            flex-shrink: 0;
          }
  
          .title {
            color: #000;
            text-align: center;
            font-family: Museo Sans;
            font-size: 23px;
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
          border-bottom-right-radius: 9px;
          border-bottom-left-radius: 9px;

          .gradient-border {
            background: linear-gradient(180deg, #ededed 50%, #cbcaca 100%);
            position: absolute;
            top: 0px;
            left: -0.3px;
            right: -0.3px;
            bottom: -0.6px;
            z-index: -1;
            border-bottom-right-radius: 9px;
            border-bottom-left-radius: 9px;
          }
        }
      }
    }
  `);

const StyledMapProductButton = styled(motion.button)(({ theme }) => ({
  display: "inline-flex",
  padding: "15px 26px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "10px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-0.88px",
  cursor: "pointer",
  height: "15px",
  width: "61%",
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

function ProductContent(props) {
  const { ProductList, categoryStrings } = props;
  const { t } = useTranslation("ProductPage");
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const onClickViewDetails = (product_id) => {
    navigate("/product/detail/" + product_id);
  };

  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(ProductList);
  const [rows, setRows] = useState([]);
  const productsPerRow = 3;

  const onSearchChanged = (event) => {
    const searchKeyword = event.target.value;
    const filteredList = ProductList.filter((product) =>
      (i18n.language == "en") 
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
      <StyledToolbar>
        <StyledSearchBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.4032 21.232C14.8336 24.8918 8.14473 24.6038 3.90877 20.3678C-0.636258 15.8228 -0.636258 8.45381 3.90877 3.90878C8.4538 -0.636259 15.8228 -0.636258 20.3678 3.90878C24.6037 8.14473 24.8918 14.8336 21.232 19.4032L30.1212 28.2925C30.6262 28.7975 30.6262 29.6162 30.1212 30.1212C29.6162 30.6262 28.7975 30.6262 28.2925 30.1212L19.4032 21.232ZM5.73755 18.539C2.20253 15.004 2.20253 9.27258 5.73755 5.73756C9.27258 2.20253 15.004 2.20253 18.539 5.73756C22.0714 9.26999 22.074 14.9956 18.5468 18.5312C18.5442 18.5338 18.5416 18.5364 18.539 18.539C18.5364 18.5416 18.5338 18.5442 18.5312 18.5468C14.9956 22.074 9.26999 22.0714 5.73755 18.539Z"
              fill="#1A1A1A"
            />
          </svg>
          <div />
          <input
            className="search-input"
            placeholder={t("Search")}
            value={search}
            onChange={onSearchChanged}
          />
        </StyledSearchBox>
      </StyledToolbar>
      <StyledContentDiv>
      <StyledCategoryList>
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
          <div className="category-item" onClick={() => {onClickedCategoryItems('ecig')}}>
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
          <div className="category-item" onClick={() => {onClickedCategoryItems('snack')}}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/snack-item.png"
                alt={t('Snacks')}
              />
              <div className="category-item-text">{t('Snacks')}</div>
            </div>
          </div>

          <div className="category-item" onClick={() => {onClickedCategoryItems('drink')}}>
            <div className="category-item-image">
              <img
                src="assets/images/products/category-nav/drink-item.png"
                alt={t('Drink')}
              />
              <div className="category-item-text">{t('Drink')}</div>
            </div>
          </div>
        </StyledCategoryList>
        <StyledDevider />
        <StyledProductList>
          {rows.map((row, rowIndex) => (
            <div className="
            product-row" key={rowIndex}>
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
      </StyledContentDiv>
    </StyledTopContainer>
  );
}

export default ProductContent;
