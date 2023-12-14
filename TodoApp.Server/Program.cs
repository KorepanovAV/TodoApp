var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

var lastKey = 0u;
var todosRepository = new List<Todo>()
{
  { new Todo(Id: lastKey++, Text: "text-1", Important: false, Done: false) },
  { new Todo(Id: lastKey++, Text: "text-2", Important: false, Done: true) },
  { new Todo(Id: lastKey++, Text: "text-3", Important: true, Done: false) },
  { new Todo(Id: lastKey++, Text: "text-4", Important: true, Done: true) },
};

var todosGroup = app.MapGroup("/api/todos")
  .WithOpenApi();

todosGroup.MapGet("/", 
  () => TypedResults.Json(todosRepository));

todosGroup.MapGet("/{id:long}", 
  (long id) => todosRepository.SingleOrDefault(t => t.Id == id) is { } todo
      ? Results.Json(todo)
      : Results.NotFound())
  .WithName("TodoById");

todosGroup.MapPost("/", 
  (NewTodo newTodo, HttpContext context, LinkGenerator linkGenerator) => 
  {
    var todo = new Todo(Id: lastKey++, newTodo.Text, newTodo.Important, newTodo.Done);
    var todoLink = linkGenerator.GetUriByName(context, endpointName: "TodoById", new { id = todo.Id });

    todosRepository.Add(todo);
    return TypedResults.Created(todoLink, todo); 
  });

todosGroup.MapPut("/{id:long}", 
  (long id, NewTodo newTodo, HttpContext context, LinkGenerator linkGenerator) => 
  {
    if (todosRepository.SingleOrDefault(i => i.Id == id) is not { } oldTodo)
      return Results.NotFound();

    var todo = new Todo(oldTodo.Id, newTodo.Text, newTodo.Important, newTodo.Done);
    var todoLink = linkGenerator.GetUriByName(context, endpointName: "TodoById", new { id = todo.Id });

    todosRepository.Remove(oldTodo);
    todosRepository.Add(todo);
    return Results.Json(todo);
  });

todosGroup.MapDelete("/{id:long}", 
  (long id) => 
  {
    if (todosRepository.SingleOrDefault(i => i.Id == id) is not { } oldTodo)
      return Results.NotFound();

    todosRepository.Remove(oldTodo);
    return Results.Ok();
  });

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
  var forecast = Enumerable.Range(1, 5).Select(index =>
      new WeatherForecast
      (
          DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
          Random.Shared.Next(-20, 55),
          summaries[Random.Shared.Next(summaries.Length)]
      ))
      .ToArray();
  return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.MapFallbackToFile("/index.html");

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
  public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

internal record Todo(long Id, string Text, bool Important, bool Done);

internal record NewTodo(string Text, bool Important, bool Done);