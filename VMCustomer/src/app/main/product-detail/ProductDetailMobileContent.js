import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import appConfig from "app/configs/appConfig";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { motion } from "framer-motion";

const StyledProductDetailContainer = styled("div")(`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    flex-shrink: 0;
    width: 100%;

    .product-thumnail-browser {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 88%;
      height: 350px;

      .product-image-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: blur(10px);
        border-radius: 10px;
        gap: 25px;
        padding: 30px;
  
        .product_image {
          z-index: 2;
          height: 295px
        }
  
        .product-sub-image {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          gap: 6px;
  
          .product-subimage-item {
            z-index: 2;
            width: 30px;
            height: 40px;
            cursor: pointer;
          }
  
          .product-subimage-item.active {
            z-index: 2;
            width: 45px;
            height: 60px;
            cursor: pointer;
            box-shadow: 0px 5px 0px 0px #1C2E33;
          }
        }
      }
    }
    
  `);

const StyledProductInfo = styled("div")(`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    gap: 10px;
    flex: 1 0 0;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);

    .product-info {
      padding: 30px;
      display: flex;
      width: 100%;
      gap: 25px;
      
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-self: stretch;

      .title {
        color: #000;
        text-align: center;
        font-family: Inter var;
        font-size: 37.257px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
      }

      .description {
        color: #1A1A1A;
        font-family: Inter var;
        font-size: 15.942px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  `);

const StyledBackBtn = styled("div")(`
    width: max-content;
    height: 30px;
    width: 30px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  
    &:active {
      transform: scale(1.2);
      background: #0e181c;
    }
  `);

const StyledViewOnMapButton = styled(motion.button)(({ theme }) => ({
  display: "flex",
  padding: "15px 26px",
  justifyContent: "center",
  alignItems: "center",
  width: "227px",
  height: "44px",
  gap: "10px",
  borderRadius: "27px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
  letterSpacing: "-1.44px",
  cursor: "pointer",
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

const StyledArrowleftBtn = styled("div")(`
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    z-index: 200;
    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.7);
    }
  `);

const StyledArrowRightBtn = styled("div")(`
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.7);
    }
  `);


function ProductDetailMobileContent(props) {
  const { t } = useTranslation("ProductDetailPage");
  const {i18n} = useTranslation();
  const { Product } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [infoImages, setInfoImages] = useState([]);

  const navigate = useNavigate();

  const onClickMapViewBtn = () => {
    navigate(`/map`, {
      state: {
        id: Product._id,
        name: Product.name
      }
    });
  };

  const onClickLeftArrow = () => {
    let current = currentIndex;
    if (current == 0) {
      current = infoImages.length - 1;
    } else {
      current--;
    }

    setCurrentIndex(current);
  };

  const onClickRightArrow = () => {
    let current = currentIndex;
    if (current == infoImages.length - 1) {
      current = 0;
    } else {
      current++;
    }

    setCurrentIndex(current);
  };

  useEffect(() => {
    let infoList = [];
    infoList.push(Product.thumbnail);
    
    if (Product.subinfoimage1) {
      infoList.push(Product.subinfoimage1);
    }

    if (Product.subinfoimage2) {
      infoList.push(Product.subinfoimage2);
    }

    if (Product.subinfoimage3) {
      infoList.push(Product.subinfoimage3);
    }

    setInfoImages(infoList);
  }, []);

  return (
    <>
      <StyledBackBtn
        onClick={() => {
          navigate("/product");
        }}
      >
        <FuseSvgIcon className="FuseSidePanel-buttonIcon">
          heroicons-outline:chevron-left
        </FuseSvgIcon>
      </StyledBackBtn>
      <StyledProductDetailContainer>
      <div className="product-thumnail-browser" >
          <StyledArrowleftBtn
            onClick={onClickLeftArrow}
          >
            <FuseSvgIcon className="FuseSidePanel-buttonIcon">
              heroicons-outline:chevron-left
            </FuseSvgIcon>
          </StyledArrowleftBtn>
          <div className="product-image-container">
            <img
              src={`${appConfig.API_SERVER}file/download/${btoa(infoImages[currentIndex])}`}
              alt={t("Product")}
              className="product_image"
            />
            <div className="product-sub-image">
              {infoImages.map((subImage, index) => {
                if (index == currentIndex) {
                  return (
                    <img
                      key={index}
                      className="product-subimage-item active"
                      src={`${appConfig.API_SERVER}file/download/${btoa(subImage)}`}
                    />
                  )
                } else {
                  return (
                    <img
                      key={index}
                      className="product-subimage-item"
                      src={`${appConfig.API_SERVER}file/download/${btoa(subImage)}`}
                      onClick={() => setCurrentIndex(index)}
                    />
                    )
                }
              })}
            </div>
          </div>
          <StyledArrowRightBtn
            onClick={onClickRightArrow}
          >
            <FuseSvgIcon className="FuseSidePanel-buttonIcon">
              heroicons-outline:chevron-right
            </FuseSvgIcon>
          </StyledArrowRightBtn>
        </div>
        <StyledProductInfo>
          <div className="product-info">
            <div className="title">{i18n.language == "en"? Product.name: Product.name_de}</div>
            <div className="description">
              {t('Price')}: {Product.price + " " + Product.currency}
              <br />
              <br />
              {i18n.language == "en" ? Product.additionalinfo1: Product.additionalinfo1_de}
              {Product.additionalinfo1 ? (
                <>
                  <br />
                </>
              ) : (
                <></>
              )}
              {i18n.language == "en" ? Product.additionalinfo2: Product.additionalinfo2_de}
              {Product.additionalinfo2 ? (
                <>
                  <br />
                </>
              ) : (
                <></>
              )}
              {i18n.language == "en" ? Product.additionalinfo3: Product.additionalinfo3_de}
              {Product.additionalinfo3 ? (
                <>
                  <br />
                </>
              ) : (
                <></>
              )}
              {i18n.language == "en" ? Product.additionalinfo4: Product.additionalinfo4_de}
              {Product.additionalinfo4 ? (
                <>
                  <br />
                </>
              ) : (
                <></>
              )}
              {i18n.language == "en" ? Product.additionalinfo5: Product.additionalinfo5_de}
              {Product.additionalinfo5 ? (
                <>
                  <br />
                  <br />
                </>
              ) : (
                <></>
              )}
              <br />
              {i18n.language == "en" ? Product.description: Product.description_de}
            </div>
            <StyledViewOnMapButton
              onClick={onClickMapViewBtn}
              whileHover={hoverAnimation}
              whileTap={tapAnimation}
            >
              {t('Map')}
            </StyledViewOnMapButton>
          </div>
        </StyledProductInfo>
      </StyledProductDetailContainer>
    </>
  );
}

export default ProductDetailMobileContent;
