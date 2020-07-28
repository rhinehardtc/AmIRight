class LikesController < ApplicationController
    def create
        like = Like.new(user_id: params[:user_id], post_id: params[:post_id])
        if like.valid?
            like.save
            render json: like
        else
            render json: {messge: 'something went wrong, try again'}
        end
    end
end
