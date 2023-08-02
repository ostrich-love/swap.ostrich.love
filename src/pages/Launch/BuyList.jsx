import { useTranslation } from 'react-i18next';
import { findNameByAddress, formatTime, fromUnit, numFormat, toFixed } from '../../lib/util';
const ClaimList = ({list}) => {
  let { t } = useTranslation()
  return (
    <table className='claim-table m-t-14'>
      <thead>
        <th>{t('Buy Date')}</th>
        <th>{t('Payment')}</th>
        <th>{t("Currency")}</th>
        <th>{t('Orich obtained')}</th>
      </thead>
      {
       list.map((item, index) => {
        return (
          <tr key={index}>
            <td>{formatTime(item.timestamp)}</td>
            <td>{fromUnit(item.currencyAmount)}</td>
            <td>{findNameByAddress(item.currency)}</td>
            <td>{numFormat(toFixed(fromUnit(item.tokenAmount),2))}</td>
          </tr>
        )
       })
      }
      

    </table>
  )
}
export default ClaimList