class DislikesController < ApplicationController
    def create
        dislike = Dislike.new(user_id: params[:user_id], post_id: params[:post_id])
        if dislike.valid?
            dislike.save
            render json: dislike
        else
            render json: {messge: 'something went wrong, try again'}
        end
    end
end
