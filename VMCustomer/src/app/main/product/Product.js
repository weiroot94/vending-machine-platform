import {Hidden} from "@mui/material";
import {useTranslation} from "react-i18next";
import ProductContent from "./ProductContent";
import ProductMobileContent from "./ProductMobileContent";
import {useEffect, useState} from "react";
import axios from "axios";
import appConfig from "app/configs/appConfig";


function ProductPage(props) {
  const [ProductList, setProductList] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const {t} = useTranslation("ProductPage");
  const categoryStrings = {
    ecig: `${t('ECig')}`,
    snack: `${t('Snacks')}`,
    drink: `${t('Drink')}`,
  };

  useEffect(() => {
    axios.post(appConfig.API_SERVER + "customer/product/list").then((res) => {
      setProductList(res.data.data);
      setLoaded(true);
    });
  }, []);

  return (
    isLoaded && (
      <>
        <Hidden lgDown>
          <div className="py-20 px-32 flex flex-row justify-center">
            <ProductContent
              ProductList={ProductList}
              categoryStrings={categoryStrings}
            />
          </div>
        </Hidden>
        <Hidden lgUp>
          <div className="py-32 px-16 flex flex-row justify-center">
            <ProductMobileContent
              ProductList={ProductList}
              categoryStrings={categoryStrings}
            />
          </div>
        </Hidden>
      </>
    )
  );
}

export default ProductPage;
