import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appConfig from "app/configs/appConfig";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { motion } from "framer-motion";
import { useState } from "react";

const StyledProductDetailContainer = styled("div")(`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    margin-top: 20px;
    padding: 40px;
    gap: 20px;

    .product-thumnail-browser {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 570px;

      .product_image_container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: white;
        flex-direction: column;
        box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        height: 550px;
        gap: 45px;

        .product_image {
          z-index: 2;
          height: 330px;
          user-select: none;
        }

        .product-sub-image {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          gap: 18px;

          .product-subimage-item {
            z-index: 2;
            width: 34px;
            height: 80px;
            cursor: pointer;
            user-select: none;
          }

          .product-subimage-item.active {
            z-index: 2;
            width: 40px;
            height: 100px;
            cursor: pointer;
            box-shadow: 0px 5px 0px 0px #1C2E33;
          }
        }
      }
    }
  `);

const StyledProductInfo = styled("div")(`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
    gap: 10px;
    align-self: stretch;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(10px);
    width: 530px;
    height: 550px;

    .product-info {
      width: 80%;
      gap: 38px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      align-self: stretch;

      .title {
        color: #000;
        text-align: center;
        font-family: Inter var;
        font-size: 55px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      .description {
        color: #1A1A1A;
        font-family: Inter var;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  `);

const StyledBackBtn = styled("div")(`
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    box-shadow: 2px 4px 5px 0px rgba(0, 0, 0, 0.3);
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(1.1);
    }
  `);

const StyledArrowleftBtn = styled("div")(`
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    box-shadow: 2px 4px 5px 0px rgba(0, 0, 0, 0.3);
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    margin-right: -20px;
    z-index: 200;
    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(1.1);
    }
  `);

const StyledArrowRightBtn = styled("div")(`
    height: 40px;
    width: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #1C2E33;
    box-shadow: 2px 4px 5px 0px rgba(0, 0, 0, 0.3);
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
    margin-left: -20px;
    z-index: 200;
    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.7);
    }
  `);

const StyledViewOnMapButton = styled(motion.button)(({ theme }) => ({
  display: "flex",
  padding: "15px 26px",
  justifyContent: "center",
  alignItems: "center",
  width: "98%",
  height: "48px",
  gap: "10px",
  borderRadius: "15px",
  border: "1px solid #000",
  background: "#1C2E33",
  color: "#FFF",
  textAlign: "center",
  fontFamily: "Museo Sans",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: "400",
  lineHeight: "normal",
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

function ProductDetailContent(props) {
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
      <StyledProductDetailContainer className="w-full">
        <div className="product-thumnail-browser" >
          <StyledArrowleftBtn
            onClick={onClickLeftArrow}
          >
            <FuseSvgIcon className="FuseSidePanel-buttonIcon">
              heroicons-outline:chevron-left
            </FuseSvgIcon>
          </StyledArrowleftBtn>
          <div className="product_image_container">
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

export default ProductDetailContent;