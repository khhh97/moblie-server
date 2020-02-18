const moment = require('moment');

exports.tableConfig = {
  // 自动维护时间戳 [ created_at、updated_at ]
  timestamps: true,
  /**
   * 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
   * 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
   */
  freezeTableName: true
};

// 共有id配置以及created_at以及updated_at时间转化
exports.getTableAttributes = (DataTypes, options) => {
  return {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ...options,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '创建时间',
      get() {
        return moment(this.getDataValue('created_at')).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      comment: '更新时间',
      get() {
        return moment(this.getDataValue('updated_at')).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
    }
  };
};
