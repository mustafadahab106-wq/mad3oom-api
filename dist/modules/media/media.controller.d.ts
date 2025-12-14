import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findAll(): Promise<import("./media.entity").Media[]>;
}
