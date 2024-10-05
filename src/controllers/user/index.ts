import { catchAsync } from '@/middlewares';
import { AppResponse } from '@/common/utils';

export const getUsers = catchAsync(async (req, res) => {
	return AppResponse(res, 200, null, 'Data retrieved successfully');
});
