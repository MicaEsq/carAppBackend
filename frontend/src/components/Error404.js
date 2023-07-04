export default function Error404({message}) {
  return (
    <>
        <div className="flex justify-center mt-10">
            <div className="flex flex-col items-center">
                <img
                    src={'/images/carNotFound.png'}
                    className="rounded-lg relative z-1"
                    height={"30%"}
                    width={"30%"}
                    alt={""}
                    title={""}
                    />
                <p className="text-[#1B2141]">{message}</p>
                <p className="text-[#1B2141]">If you have doubts, feel free to reach out :)</p>
            </div>
        </div>
    </>
    )
}