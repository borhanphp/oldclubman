import auth from "@/views/auth/store";
import common from "./common";
import settings from "@/views/settings/store";
import nfc from "@/views/nfc/store";
import gathering from "@/views/gathering/store";
import chat from "@/views/message/store";
import search from "@/views/search/store";




const rootReducer = {
    common,
    auth,
    settings,
    nfc,
    gathering,
    chat,
    search
}

export default rootReducer;