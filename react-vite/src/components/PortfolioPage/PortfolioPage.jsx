import './PortfolioPage.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfoThunk, updateUserBalanceThunk } from '../../redux/users.js';
import { getUserStocksThunk, removeAllUserStocksThunk } from '../../redux/portfolio.js';
import ConfirmDeleteModal from './DeleteConfirmation.jsx'
import { useModal } from '../../context/Modal';
import PortfolioStocksList from '../PortfolioStocksList';

function PortfolioPage(){
    const dispatch = useDispatch()
    const [fund ,setFund] = useState(0)
    // const [errors, setErrors] =useState({})
    const { setModalContent, closeModal } = useModal();
    const userInfo = useSelector((users) =>users.userInfo.userInfo)
    const userStocks = useSelector((portfolio)=>portfolio.portfolio.userStocks)
    

    useEffect(()=>{
        dispatch(getUserInfoThunk());
        dispatch(getUserStocksThunk())
    },[dispatch])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserBalanceThunk(fund))
    }

    
    const handleClick = (e) => {
        e.preventDefault();
        
        let totalStockValue = 0
        for (let userStock of userStocks.values()) {
            totalStockValue += userStock.share_price * userStock.share_quantity
        }

        setModalContent(
			<ConfirmDeleteModal
                stockValue={totalStockValue}
				onConfirm={() => {
                    dispatch(removeAllUserStocksThunk()).then(()=>{
                        dispatch(updateUserBalanceThunk(totalStockValue))
                    }).then(()=>{
                        closeModal();
                    })
				}}
				onCancel={closeModal}
			/>
		);

    }

    let market_value=0
    for (let stock of userStocks.values()) {
        market_value += stock.share_quantity * stock.updated_price
    }
    const total_balance = market_value + userInfo?.cash_balance;

    const formattedMarketValue=market_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedCashBalance = userInfo?.cash_balance ? userInfo.cash_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    const formattedTotalBalance =  userInfo?.cash_balance ? (userInfo.cash_balance+market_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    return (
        <>
            <div className='user-info'>
                <p className='username'>{userInfo? userInfo.username : null}</p>
                <p className='user-email'>{userInfo? userInfo.email : null}</p>
                <ul className='balances'>
                    <li className='user-cash-balance'>Cash Balance : $ {formattedCashBalance}</li>
                    <li className='stock-value-balance'>Stock Market Value : $ {formattedMarketValue}</li>
                    <li className='total-balance'>Total Balance : $ {formattedTotalBalance}</li>
                </ul>
            </div>
            <div className="header-container">
                <form className="add-fund-form" onSubmit={handleSubmit}>
                    <input type='number' step="0.01" min="0" placeholder="Enter amount here..." onChange={(e) => setFund(parseFloat(e.target.value))}></input>
                    <button className='add-fund-button'>Add Fund</button>
                </form>
                
                <button className='liquidate-portfolio-button' onClick={handleClick}>Liquidate Portfolio</button>
            </div>
            <div className="portfolio-watchlist-stocks-container">
                {Object.keys(userStocks).length && <PortfolioStocksList stocks={userStocks} pageSize={10} heightPx={675}/>}
            </div>
        </> 
    )
}

export default PortfolioPage