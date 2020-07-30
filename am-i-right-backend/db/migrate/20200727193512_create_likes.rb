class CreateLikes < ActiveRecord::Migration[6.0]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.boolean :agree, null: false, default: false
      t.boolean :disagree, null: false, default: false

      t.timestamps
    end
  end
end
