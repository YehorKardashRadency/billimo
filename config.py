
class Config:
    # POSTGRES_CONNECTION = "Server=localhost; Port=5433; User Id=postgres; Password=L7XQf2yL2l; Database=invoicing"
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:L7XQf2yL2l@localhost:5433/invoicing"
    RABBITMQ_CONNECTION = "amqp://guest:guest@localhost:5672"
    ADMINISTRATION_API = "https://localhost:7086/api"
