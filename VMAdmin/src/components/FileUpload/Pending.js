import './style.css'
const Pending = () => {
  return (
    <div className="flex flex-col drop-shadow-lg p-5 justify-between bg-white rounded-md"  style={{ width: "100%" }}>
      <p className="text-sm w-15 mb-5 font-semibold">Uploading...</p>
      <div className="w-full p-0 h-1 bg-grey mb-5 relative">
        <div className="absolute w-0 loader bg-blue h-1"/>
      </div>
    </div>
  )
}

export default Pending
