
//import CheckIcon from '@mui/icons-material/Check';
const Uploaded = ({image , url}) => {

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    alert('Link copied');
  }

  return (
    <div className='flex flex-col drop-shadow-lg p-5 justify-between bg-white rounded-md'  style={{ width: "100%" }}>
      <div>
      <p className='font-normal text-center text-xl mb-10'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 mx-auto fill-white bg-green p-2 rounded-full">
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
        </svg>
        Uploaded Successfully!
      </p>
      </div>
      <div className='relative bg-light-grey p-4 overflow-auto w-full rounded-lg  align-middle overflow-hidden' style={{ height: "40px", textAlign: "center" }}>
        <button onClick={copy} className='absolute w-full right-1 top-1 bottom-1 bg-blue text-white rounded-lg md:px-4 md:py-1'>Copy File Path</button>
      </div>
    </div>
  )
}

export default Uploaded
