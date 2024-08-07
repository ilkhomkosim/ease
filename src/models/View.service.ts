import Errors from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";

class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

    public async checkViewExistance(input: ViewInput): Promise<View> {
        const { memberId, viewRefId } = input;
        return await this.viewModel.findOne({ memberId: memberId, viewRefId: viewRefId }).exec();
    }

    public async insertMemberView(input: ViewInput): Promise<View> {
        try {
            const newView = new this.viewModel(input);
            const savedView = await newView.save();
            return savedView;
        } catch (error) {
            throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
        }
    }
    
}

export default ViewService;
