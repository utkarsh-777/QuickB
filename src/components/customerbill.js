import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Axios from "axios"

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
 });

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    protein,
    price,
    history: [
      { date: carbs.date, customerId: carbs.description, amount: carbs.bill_amount,bid:carbs.bid },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
 //console.log('row',row)

  return (
    <React.Fragment>
      <TableRow className={classes.root}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Bill Id</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {historyRow.bid}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

var rows=[]

export default function CollapsibleTable() {
    
    const[Udata,setUdata]=useState([])

    const handleSubmit = e => {
        var val=e
         Axios({
             method:"post",
             url:"http://localhost:5000/api/customerbills",
             headers:{
                 "Content-Type":"application/json",
                 Authorization:localStorage.getItem("token")
             },
             data:{
                 cname:val
             }
         })
         .then(res=>{
             if(res.data.length>0){
                 setUdata(res.data)
             }
             if(res.error){
                 setUdata([])
             }
         })
         .catch(err=>console.log(err))
     }
     if(Udata.length>0)
     {
        rows = []
        for(var i=0;i<Udata.length;i++){
            rows[i] = createData(Udata[i].cname,Udata[i].mobile, Udata[i].address,Udata[i])
        }
     }
  return (
    <div>
      <div className='container mt-4'>
      <h2 className='mb-3'>Search Bills By Customer Name</h2>
      <label for='cname'>Enter the Customer Name</label>
      <input type='text' name='cname' className='form-control mb-5' placeholder='Customer Name' onChange={(e)=>handleSubmit(e.target.value)} />
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Customer Name</TableCell>
            <TableCell align="right">Mobile</TableCell>
            <TableCell align="right">Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {rows.map((row) => {
              console.log(row)
              return(
            <Row key={row.bid} row={row} />
              )
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </div>
  );
}
