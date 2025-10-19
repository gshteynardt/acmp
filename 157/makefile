NAME = 157cstdio-unsafe
CXX = /opt/homebrew/opt/llvm/bin/clang++
CXXFLAGS = -std=c++20 -O2 -Wall -Wextra

$(NAME): $(NAME).cpp
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -f $(NAME)

run: clean $(NAME)
	./$(NAME)
