import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Addcar from './Addcar'



export default function Carlist () {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getCars();
    }, [])

    const getCars = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json()) 
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (link) => {
        if (window.confirm('Are you sure?')) {
        fetch(link, {method: 'DELETE'})
        .then(_ => getCars())
        .then(_ => setOpen(true))
        .catch(err => console.error(err))
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const addCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars',
            {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(car)
            }
        )
        .then(_ => getCars)
        .catch(err => console.error(err))
    }
    
    const columns = [ 
        {
            Header: 'Brand',
            accessor: 'brand'
        },
        {
            Header: 'Model',
            accessor: 'model'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            Cell: row => (<Button size="small" color="secondary" onClick={() => deleteCar(row.original._links.self.href)}>Delete</Button>)
        }
    ]
    
    return(
        <div>
            <Addcar addCar={addCar} />
            <ReactTable defaultPageSize={10} filterable={true} data={cars} columns={columns} />
            <Snackbar 
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            message={'Car deleted'} 
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            
            />
        </div>
    );
}