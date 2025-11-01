import {styled} from "@mui/material/styles";
import { useState } from "react";
import {useTranslation} from "react-i18next";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import { useAuth } from "src/app/auth/AuthContext";

function PaymentHistoryMobileContent(props) {
  const StyledPurchaseHistoryContainer = styled("div")(`
    width: 100%;

    .title {
      color: #000;
      text-align: center;
      font-family: Museo Sans;
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -2.4px;
      padding-bottom: 20px;
    }
  `);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1D2D35",
      color: theme.palette.common.white,
      fontSize: "16px",
      fontFamily: "Museo Sans",
      fontWeight: "300",
      marginTop: "30px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontFamily: "Museo Sans",
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const {t} = useTranslation("PurchaseHistoryPage");
  const {paymentHistory, tablePaginationActions} = props;
  const {name} = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - paymentHistory.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledPurchaseHistoryContainer>
      <div className="title">{t('Title')}</div>
      <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t('Date')}</StyledTableCell>
            <StyledTableCell align="left">{t('Transaction')}</StyledTableCell>
            <StyledTableCell align="right">{t('Amount')}($)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {(rowsPerPage > 0
            ? paymentHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : paymentHistory
          ).map((item, index) => (
          <StyledTableRow key={index}>
            <StyledTableCell component="th" scope="row">
              {item.date}
            </StyledTableCell>
            <StyledTableCell align="left">
              {item.product ?
                <>
                  {t('Purchased')} <span style={{ color: 'blue' }}>{item.amount} {item.product.name}</span>(s)
                </>
                :
                <>
                  {item.method == 'paypal'
                  ?
                  <span style={{ color: 'blue' }}>PayPal </span>
                  : ""} 
                  {t('Deposited')} <span style={{ color: 'green' }}>{name}</span> {t('At')} {item.date}
                </>
              }
            </StyledTableCell>
            <StyledTableCell align="right">
              {item.product ?
                <span style={{ color: 'red' }}>-{(item.product.price * item.amount).toLocaleString('en-US')}</span>
                :
                <span style={{ color: 'green' }}>{item.amount.toLocaleString('en-US')}</span>
              }
            </StyledTableCell>
          </StyledTableRow>
        ))}
        {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
      </TableBody>
      <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[8, 10, 12, { label: 'All', value: -1 }]}
              colSpan={3}
              count={paymentHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': `${t("Row_Label")}`,
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={tablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </StyledPurchaseHistoryContainer>
  );
}

export default PaymentHistoryMobileContent;
