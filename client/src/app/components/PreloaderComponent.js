import gif from "../../../public/Settings.gif";
import Image from "next/image";

function Preloader(){
    return(
        <div className="flex justify-center items-center full">
            <Image priority={false} src={gif} alt="my gif" height={100} width={100} unoptimized/>
        </div>
    );
}
export default Preloader;