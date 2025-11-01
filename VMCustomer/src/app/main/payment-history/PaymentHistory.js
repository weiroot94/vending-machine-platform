import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "src/app/auth/AuthContext";
import {Hidden} from "@mui/material";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PaymentHistoryContent from "./PaymentHistoryContent";
import PaymentHistoryMobileContent from "./PaymentHistoryMobileContent";
import appConfig from "app/configs/appConfig";

function PaymentHistoryPage(props) {
  const {isAuthenticated, setNavigateUrl, token} = useAuth();
  const [paymentlist, setPaymentList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const tablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setNavigateUrl("/payment");
      navigate("/sign-in");
    } else {
      let purchaseHistory;
      let depositHistory;
      axios.post(appConfig.API_SERVER + "customer/purchase/history", {user_token: token}).then(res => {
        purchaseHistory = res.data.data;
        axios.post(appConfig.API_SERVER + "customer/deposit/list", {user_token: token}).then(res => {
          depositHistory = res.data.data;
          const payList = [...purchaseHistory, ...depositHistory];
          payList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
          });
          setPaymentList(payList);
          setIsLoaded(true);
        });
      });
    }
  }, []);

  return (
    isLoaded && (
    <>
      <Hidden lgDown>
        <div className="py-20 px-32 flex flex-row justify-center">
          <PaymentHistoryContent paymentHistory={paymentlist} tablePaginationActions={tablePaginationActions} />
        </div>
      </Hidden>
      <Hidden lgUp>
        <div className="py-32 px-16 flex flex-row justify-center">
          <PaymentHistoryMobileContent paymentHistory={paymentlist} tablePaginationActions={tablePaginationActions} />
        </div>
      </Hidden>
    </>
    )
  );
}

export default PaymentHistoryPage;
