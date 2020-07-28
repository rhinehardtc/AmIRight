class UsersController < ApplicationController
    def index
        users = User.all
        render json: users
    end

    def show
        user = User.find_by(id: params['id'])
        if user
            render json: user
        else
            render json: {message: 'User Not Found, Coward.'}
        end
    end

    def create
        user = User.new(name: params[:name], password: params[:password])
        if user.valid?
            user.save
            render json: user
        else
            render json: {
                message: user.errors.messages
            }
        end
    end
end
