window.Mirror_Scene= window.classes.Mirror_Scene =
    class Mirror_Scene extends Scene_Component {
        constructor(context, control_box)
        {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            context.globals.graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0));
            this.initial_camera_location = Mat4.inverse(context.globals.graphics_state.camera_transform);

            this.initial_avatar_location = Mat4.identity().times(Mat4.translation([0,0,5]));
            this.avatar_pos = this.initial_avatar_location;

            const r = context.width / context.height;
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

            const shapes = {
                torus: new Torus(15, 15),
                torus2: new (Torus.prototype.make_flat_shaded_version())(15, 15),

                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                //        (Requirement 1)
                sphere1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
                sphere2: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
                sphere3: new Subdivision_Sphere(3),
                sphere4: new Subdivision_Sphere(4),
                sphere5: new (Grid_Sphere.prototype.make_flat_shaded_version())(10,10),
                box: new Cube(),
                mirror: new Plane_Mirror(50,50)
            };
            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.materials =
                {
                    avatar: context.get_instance(Phong_Shader).material(Color.of(0,0,1,1), {ambient: 0.0}),
                    wall: context.get_instance(Phong_Shader).material(Color.of(1,1,1,1), {ambient: 1}),
                    mirror: context.get_instance(Phong_Shader).material(Color.of(.95,1,.95,1), {ambient:0.0, diffusivity: 0})
                };

            this.lights = [new Light(Vec.of(0, 10, 0, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 8, 30, 1), Color.of(1, 1, 1, 1), 1000),
                           new Light(Vec.of(0, 8, -30, 1), Color.of(1, 1, 1, 1), 1000)];

            this.move_r_pressed = false;
            this.move_l_pressed = false;
            this.move_u_pressed = false;
            this.move_d_pressed = false;
        }
        set_pos(dir)
        {
            if(dir==1)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([-.5,0,0]));
            else if(dir==2)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([0,.5,0]));
            else if(dir==3)
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([0,-.5,0]));
            else
                this.avatar_pos=this.avatar_pos.times(Mat4.translation([.5,0,0]));
            this.move_l_pressed = false;
            this.move_r_pressed = false;
            this.move_u_pressed = false;
            this.move_d_pressed = false;
        }

        make_control_panel() {
            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

            this.key_triggered_button("Move Avatar Right", ["5"], () => {this.move_r_pressed = true});
            this.key_triggered_button("Move Avatar Left", ["6"], () => {this.move_l_pressed = true});
            this.new_line();
            this.key_triggered_button("Move Avatar Up", ["7"], () => {this.move_u_pressed = true});
            this.key_triggered_button("Move Avatar Down", ["8"], () => {this.move_d_pressed = true});
            this.new_line();
            this.new_line();
            this.new_line();
            this.key_triggered_button("View whole scene", ["0"], () => this.attached = () => this.initial_camera_location);
            this.new_line();
            this.key_triggered_button("Attach to mirror 1", ["1"], () => this.attached = () => this.mirror_1);
            this.key_triggered_button("Attach to mirror 2", ["2"], () => this.attached = () => this.mirror_2);
            this.new_line();
            this.key_triggered_button("Attach to mirror 3", ["3"], () => this.attached = () => this.mirror_3);
            this.key_triggered_button("Attach to avatar 4", ["a"], () => this.attached = () => this.avatar);
            this.new_line();
        }

        display(graphics_state) {
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
            let identity = Mat4.identity();
            // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
            this.shapes.mirror.draw(graphics_state,identity.times(Mat4.scale([.25,.5,.05])),this.materials.mirror);
            //this.shapes.box.draw(graphics_state,identity.times(Mat4.scale([100,100,.05])),this.materials.wall);
            if(this.move_r_pressed)
                this.set_pos(0);
            else if(this.move_l_pressed)
                this.set_pos(1);
            else if(this.move_u_pressed)
                this.set_pos(2);
            else if(this.move_d_pressed)
                this.set_pos(3);
            this.shapes.sphere4.draw(graphics_state,this.avatar_pos,this.materials.avatar);
            this.shapes.sphere4.draw(graphics_state,this.avatar_pos.times(Mat4.translation([0,0,-10])),this.materials.avatar);





            //camera coordinates
            let translate_back = Mat4.translation(Vec.of(0,0,5));
            if(typeof this.attached !== 'undefined') {
                switch (this.attached()) {
                    case (this.initial_camera_location):
                        graphics_state.camera_transform = Mat4.look_at(Vec.of(0, 5, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                        /*
                    case (this.mirror_1):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_1.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.mirror_2):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_2.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.mirror_3):
                        graphics_state.camera_transform = Mat4.inverse(this.mirror_3.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;
                    case (this.avatar):
                        graphics_state.camera_transform = Mat4.inverse(this.avatar.times(translate_back)).map((x,i) => Vec.from(graphics_state.camera_transform[i]).mix(x,0.1));
                        break;*/
                }

            }

        }
    };


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
    class Ring_Shader extends Shader {
        // Subclasses of Shader each store and manage a complete GPU program.
        material() {
            // Materials here are minimal, without any settings.
            return {shader: this}
        }

        map_attribute_name_to_buffer_name(name) {
            // The shader will pull single entries out of the vertex arrays, by their data fields'
            // names.  Map those names onto the arrays we'll pull them from.  This determines
            // which kinds of Shapes this Shader is compatible with.  Thanks to this function,
            // Vertex buffers in the GPU can get their pointers matched up with pointers to
            // attribute names in the GPU.  Shapes and Shaders can still be compatible even
            // if some vertex data feilds are unused.
            return {object_space_pos: "positions"}[name];      // Use a simple lookup table.
        }

        // Define how to synchronize our JavaScript's variables to the GPU's:
        update_GPU(g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl) {
            const proj_camera = g_state.projection_transform.times(g_state.camera_transform);
            // Send our matrices to the shader programs:
            gl.uniformMatrix4fv(gpu.model_transform_loc, false, Mat.flatten_2D_to_1D(model_transform.transposed()));
            gl.uniformMatrix4fv(gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(proj_camera.transposed()));
        }

        shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
        }

        vertex_glsl_code()           // ********* VERTEX SHADER *********
        {
            return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        position = vec4(object_space_pos,1.0);
        center = vec4(0.0,0.0,0.0,1.0);
        gl_Position = projection_camera_transform* model_transform * position;
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        }

        fragment_glsl_code()           // ********* FRAGMENT SHADER *********
        {
            return `
        void main()
        { 
        if(distance(position,center) <= 2.5)
        {
        if(distance(position,center) >= 1.26)
        {
        if(sin(30.0* distance(position,center)) > 0.0)
            gl_FragColor = vec4(0.0,0.0,0.0,1.0);
        else
            gl_FragColor = vec4(.5,.3,.2,1.0);
        }
        }
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        }
    };

window.Grid_Sphere = window.classes.Grid_Sphere =
    class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at
    {
        constructor(rows, columns, texture_range)             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
        {
            super("positions", "normals", "texture_coords");
            // TODO:  Complete the specification of a sphere with lattitude and longitude lines
            //        (Extra Credit Part III)
            const semi_circle_points = Array(rows).fill(Vec.of(0,0,1))
                .map((p, i, a) =>
                    Mat4.rotation(i / (a.length - 1) * Math.PI, Vec.of(0, -1, 0))
                    .times(p.to4(1)).to3());
            Surface_Of_Revolution.insert_transformed_copy_into(this,[rows,columns,semi_circle_points]);
        }
    };
