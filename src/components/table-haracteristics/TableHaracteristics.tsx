import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface TableHaracteristicsProps {
  characteristics: {
    name: string;
    value: string;
  }[];
}

const TableHaracteristics: React.FC<TableHaracteristicsProps> = ({ characteristics }) => {
  return (
    <section>
      <label className="text-2xl font-bold">Всі характеристики</label>
      <TableContainer component={Paper} className="mt-5 max-w-[800px]">
        <Table sx={{ minWidth: 650, backgroundColor: '#f9f9f9' }} aria-label="simple table">
          <TableBody>
            {characteristics.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default TableHaracteristics;
