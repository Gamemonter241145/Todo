module.exports.getDateTODat = getDateTODat
function getDateTODat()
{
    const dateOption:  Intl.DateTimeFormatOptions =
{
    weekday : 'long',
    year : 'numeric',
    month : 'long',
    day:'numeric'
}
return new Date().toLocaleDateString('th-TH',dateOption);
}
module.exports.xx = xx;
function xx()
{

}