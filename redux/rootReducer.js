import auth from "@/views/auth/store";
import common from "./common";
import settings from "@/views/settings/store";
import nfc from "@/views/nfc/store";
import gathering from "@/views/gathering/store";




const rootReducer = {
    common,
    auth,
    settings,
    nfc,
    gathering
}

export default rootReducer;